import "purecss/build/pure.css";
import * as React from "react";
import "../styles.scss";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import {
    Container,
    Grid,
    IconButton,
    Link as MuiLink,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import ToJyutping from "to-jyutping";
import { pinyin } from 'pinyin-pro';

import { getLocaleText, I18nText } from "../utils/I18n";

interface Pronunciation {
    hanzi: string;
    py_initial: string;
    py_final: string;
    py_tone: number;
    jp_initial: string;
    jp_final: string;
    jp_tone: number;
    my_initial: string;
    my_final: string;
    my_tone: number;
}

const Highlight = styled("span")(({ theme }) => ({
    color: theme.palette.error.main,
}));

function mergeArrays(array1: [string, string | null][], array2: string[]): string[][] {
    const mergedArray: string[][] = [];

    for (let i = 0; i < array1.length; i++) {
        const [, secondMember] = array1[i];
        let temp = [];
        if (secondMember !== null) {
            temp.push(array1[i][0]);
            temp.push(secondMember);
            if (i < array2.length) {
                temp.push(array2[i]);
                mergedArray.push(temp);
            }
        }
    }
    return mergedArray;
}

const simple_mapper_initial = new Map([
    ["b", "b"], ["p", "p"], ["m", "m"], ["f", "f"],
    ["d", "d"], ["t", "t"], ["n", "n"], ["l", "l"],
    ["g", "g"], ["k", "k"], ["h", "h"],
    ["j", ""], ["q", ""], ["x", ""],
    ["zh", "z"], ["ch", "c"], ["sh", "s"], ["r", "j"],
    ["z", "z"], ["c", "c"], ["s", "s"],
]);

const simple_mapper_final = new Map([
    ["a", "aa"], ["ia", "aa"], ["ua", "aa"],
    ["o", "o"], ["uo", "o"], ["ie", "e"],
    ["uai", "aai"],
    ["ueng", "ung"], ["ong", "ung"], ["iong", "ung"],
    ["an", "aan"], ["ian", "in"], ["in", "an"], // 此行先忽略m者
    ["er", "i"], ["ui", "eoi"], ["uei", "eoi"], ["iao", "iu"],
    ["ou", "au"], ["iu", "au"], ["iou", "au"],
    ["en", "an"], ["uen", "eon"], ["yun", "an"],
    ["iang", "oeng"], ["uang", "ong"],
]);

const mancan_convert = (py_initial: string,
    py_final: string,
    py_tone: number): [string, string, number] => {
    let my_initial = simple_mapper_initial.get(py_initial) || "";
    let my_final = simple_mapper_final.get(py_final) || "";
    let my_tone = 0;
    if (py_tone == 1) my_tone = 1;
    else if (py_tone == 2) my_tone = 4;
    return [my_initial, my_final, my_tone];
}

const hanjppy_add_my = (hanjppy: string[]): Pronunciation => {
    let [hanzi, jp, py] = hanjppy;

    // 拆解 jyut ping
    let jp_tone = 0;
    if (!isNaN(parseInt(jp.charAt(jp.length - 1)))) {
        jp_tone = parseInt(jp.charAt(jp.length - 1));
        jp = jp.slice(0, -1);
    }
    let jp_initial = "";
    let i = 0;
    while (i < jp.length && !'aeiouy'.includes(jp.charAt(i))) {
        jp_initial += jp.charAt(i);
        i++;
    }
    let jp_final = jp.slice(i);

    // 拆解 pinyin
    py = py.replace(/yi/g, 'i');
    py = py.replace(/y/g, 'i');
    py = py.replace(/wu/g, 'u');
    py = py.replace(/ü/g, 'yu');
    let py_tone = 0;
    if (!isNaN(parseInt(py.charAt(py.length - 1)))) {
        py_tone = parseInt(py.charAt(py.length - 1));
        py = py.slice(0, -1);
    }
    let py_initial = "";
    i = 0;
    while (i < py.length && !'aeiouy'.includes(py.charAt(i))) {
        py_initial += py.charAt(i);
        i++;
    }
    let py_final = py.slice(i);

    let [my_initial, my_final, my_tone] = mancan_convert(py_initial, py_final, py_tone);

    return {
        hanzi: hanzi,
        jp_initial: jp_initial,
        jp_final: jp_final,
        jp_tone: jp_tone,
        py_initial: py_initial,
        py_final: py_final,
        py_tone: py_tone,
        my_initial: my_initial,
        my_final: my_final,
        my_tone: my_tone
    };
}

function translateMandarinToCantonese(input: string): Pronunciation[] {
    let jps = ToJyutping.getJyutpingList(input);

    let pys = pinyin(input, {
        toneType: 'num',              // 启用多音字模式
        type: 'array',                // 启用分词，以解决多音字问题。默认不开启，使用 true 开启使用 Intl.Segmenter 分词库。
    })

    // [[hanzi, jp, py]...]
    let mergedArray = mergeArrays(jps, pys);

    console.log(jps)
    console.log(pys)
    console.log(mergedArray)

    // 模拟转换逻辑，返回示例数据
    return mergedArray.map(hanjppy_add_my);
}

export default function Home(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const [input, setInput] = React.useState<string>("");
    const [result, setResult] = React.useState<Pronunciation[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = () => {
        const characters = input;
        const translations = translateMandarinToCantonese(characters);
        setResult(translations);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h5">
                {getLocaleText(
                    {
                        "zh-Hans": "普通粤",
                        "zh-Hant": "普通粵",
                        en: "Mancan",
                        ja: "Mancan",
                        de: "Mancan",
                        ko: "Mancan",
                        "ko-Han": "Mancan",
                        eo: "Mancan",
                        fr: "Mancan",
                        vi: "Mancan",
                        "vi-Han": "Mancan",
                        es: "Mancan",
                        "tto-bro": "Mancan",
                        tto: "Mancan",
                    },
                    lang
                )}
            </Typography>

            <Typography variant="body1">
                {getLocaleText(
                    {
                        "zh-Hans": "目前使用最简单的推导规则，并标出所有不合此规则之要素。",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1">

                <MuiLink href="https://github.com/pustot/PustoNoto/blob/master/400-Lingvo/400-zh-yue-%E7%B2%B5-Kantona.md#%E6%99%AE%E8%BD%89%E7%B2%B5%E8%BD%AC%E6%8D%A2%E8%A7%84%E5%88%99%E4%B8%8E%E4%B8%8D%E8%A7%84%E5%88%99%E6%80%BB%E7%BB%93"
                    target="_blank" rel="noopener noreferrer">
                    规则说明
                </MuiLink>
            </Typography>


            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <TextField label="输入汉字" variant="outlined" value={input} onChange={handleInputChange} fullWidth />
                <Button variant="contained" onClick={handleSubmit}>转换</Button>
                <Box mt={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {result.map((pronunciation, index) => (
                        <Tooltip
                            key={index}
                            title={
                                <>
                                    <Typography>普通话: {pronunciation.py_initial + pronunciation.py_final + pronunciation.py_tone}</Typography>
                                    <Typography>粤语: {pronunciation.jp_initial + pronunciation.jp_final + pronunciation.jp_tone}</Typography>
                                </>
                            }
                            placement="top"
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                                <Typography sx={{ fontSize: '0.75em', lineHeight: '1' }}>
                                    {pronunciation.jp_initial !== pronunciation.my_initial ? <Highlight>{pronunciation.jp_initial}</Highlight> : pronunciation.jp_initial}
                                    {pronunciation.jp_final !== pronunciation.my_final ? <Highlight>{pronunciation.jp_final}</Highlight> : pronunciation.jp_final}
                                    {pronunciation.jp_tone !== pronunciation.my_tone ? <Highlight>{pronunciation.jp_tone}</Highlight> : pronunciation.jp_tone}
                                </Typography>
                                <Typography sx={{ lineHeight: '1.5' }}>{pronunciation.hanzi}</Typography>
                            </Box>
                        </Tooltip>
                    ))}
                </Box>
            </Box>


        </Container>
    );
}
