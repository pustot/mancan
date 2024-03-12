import "purecss/build/pure.css";
import * as React from "react";
import "../styles.scss";

import {
    Box,
    Button,
    Checkbox,
    ClickAwayListener,
    Container,
    FormControlLabel,
    Link as MuiLink,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { pinyin } from 'pinyin-pro';
import ToJyutping from "to-jyutping";

import { getLocaleText, I18nText } from "../utils/I18n";
import { mancan_convert, mancan_options } from "../utils/mancan_convert";

interface Pronunciation {
    hanzi: string;
    py_initial: string;
    py_final: string;
    py_tone: string;
    jp_initial: string;
    jp_final: string;
    jp_tone: string;
    my_initial: string;
    my_final: string;
    my_tone: string;
}

const Highlight = styled("span")(({ theme }) => ({
    color: theme.palette.error.main,
}));

const GreenHighlight = styled("span")(({ theme }) => ({
    color: theme.palette.success.main,
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

export default function Home(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const [input, setInput] = React.useState<string>("廣州話");
    const [result, setResult] = React.useState<Pronunciation[]>([]);
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

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
        let py_origin = py;
        py = py.replace(/yi/g, 'i');
        py = py.replace(/y/g, 'i');
        py = py.replace(/wu/g, 'u');
        py = py.replace(/ü/g, 'yu');
        let py_tone = "0";
        if (!isNaN(parseInt(py.charAt(py.length - 1)))) {
            py_tone = py.charAt(py.length - 1);
            py = py.slice(0, -1);
        }
        let py_initial = "";
        i = 0;
        while (i < py.length && !'aeiouy'.includes(py.charAt(i))) {
            py_initial += py.charAt(i);
            i++;
        }
        let py_final = py.slice(i);

        let [my_initial, my_final, my_tone] = mancan_convert(
            py_origin, py_initial, py_final, py_tone, selectedOptions, jp_final
        );

        return {
            hanzi: hanzi,
            jp_initial: jp_initial,
            jp_final: jp_final,
            jp_tone: "" + jp_tone,
            py_initial: py_initial,
            py_final: py_final,
            py_tone: "" + py_tone,
            my_initial: my_initial,
            my_final: my_final,
            my_tone: "" + my_tone
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = () => {
        const characters = input;
        const translations = translateMandarinToCantonese(characters);
        setResult(translations);
    };

    const [openTooltipIndex, setOpenTooltipIndex] = React.useState<number | null>(null);

    const handleTooltipClose = () => {
        setOpenTooltipIndex(null);
    };

    const handleTooltipOpen = (index: number) => {
        setOpenTooltipIndex(openTooltipIndex === index ? null : index);
    };

    // 处理单个选项的点击
    const handleOptionChange = (value: string) => {
        setSelectedOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value],
        );
    };

    // 全选
    const handleSelectAll = () => {
        setSelectedOptions(mancan_options.map((option) => option.value));
    };

    // 全不选
    const handleDeselectAll = () => {
        setSelectedOptions([]);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h3" m={2}>
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

            <Typography variant="body1" m={1}>
                {getLocaleText(
                    {
                        "zh-Hans": "使用通用而简单的推导规则，直接用普通话读音推到广州话读音，并标出所有不合此规则之要素。",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" m={1}>
                {getLocaleText(
                    {
                        "zh-Hans": "符合以下最简单一对一规则者，该部分拼音显示为黑色（暗色模式为白色）。",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" m={1}>

                <MuiLink href="https://github.com/pustot/PustoNoto/blob/master/400-Lingvo/400-zh-yue-%E7%B2%B5-Kantona.md#%E6%99%AE%E8%BD%89%E7%B2%B5%E8%BD%AC%E6%8D%A2%E8%A7%84%E5%88%99%E4%B8%8E%E4%B8%8D%E8%A7%84%E5%88%99%E6%80%BB%E7%BB%93"
                    target="_blank" rel="noopener noreferrer">
                    规则说明
                </MuiLink>
            </Typography>

            <Typography variant="body1" m={1}>
                {getLocaleText(
                    {
                        "zh-Hans": "符合以下复选框中选中的比较通用的规则者，该部分拼音显示为绿色。",
                    },
                    lang
                )}
            </Typography>

            {/* 显示选项 */}
            <Box m={2}>
                {mancan_options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                checked={selectedOptions.includes(option.value)}
                                onChange={() => handleOptionChange(option.value)}
                            />
                        }
                        label={option.label}
                    />
                ))}
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Button variant="contained" onClick={handleSelectAll} sx={{ mr: 2 }}>全选</Button>
                    <Button variant="contained" onClick={handleDeselectAll}>全不选</Button>
                </Box>
            </Box>

            <Typography variant="body1" m={1}>
                {getLocaleText(
                    {
                        "zh-Hans": "不符合上述规则者，该部分拼音显示为红色。",
                    },
                    lang
                )}
            </Typography>


            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <TextField label="输入汉字" variant="outlined" value={input}
                    multiline placeholder="問天地好在。我而家學緊廣州話。"
                    onChange={handleInputChange} fullWidth />
                <Button variant="contained" onClick={handleSubmit}>转换</Button>

                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Box mt={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {result.map((pronunciation, index) => (
                            <Tooltip
                                key={index}
                                PopperProps={{
                                    disablePortal: true,
                                }}
                                onClose={handleTooltipClose}
                                open={openTooltipIndex === index}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={
                                    <>
                                        <Typography>普通话: {pronunciation.py_initial + pronunciation.py_final + pronunciation.py_tone}</Typography>
                                        <Typography>粤语: {pronunciation.jp_initial + pronunciation.jp_final + pronunciation.jp_tone}</Typography>
                                    </>
                                }
                            >
                                <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}
                                    onMouseEnter={() => handleTooltipOpen(index)}
                                    onMouseLeave={handleTooltipClose}
                                    onClick={() => handleTooltipOpen(index)}
                                >
                                    <Typography sx={{ fontSize: '1em', lineHeight: '1' }}>
                                        {pronunciation.jp_initial !== pronunciation.my_initial ?
                                            (pronunciation.my_initial.split('/').some(part => part === pronunciation.jp_initial) ?
                                                <GreenHighlight>{pronunciation.jp_initial}</GreenHighlight> :
                                                <Highlight>{pronunciation.jp_initial}</Highlight>) :
                                            pronunciation.jp_initial}
                                        {pronunciation.jp_final !== pronunciation.my_final ?
                                            (pronunciation.my_final.split('/').some(part => part === pronunciation.jp_final) ?
                                                <GreenHighlight>{pronunciation.jp_final}</GreenHighlight> :
                                                <Highlight>{pronunciation.jp_final}</Highlight>) :
                                            pronunciation.jp_final}
                                        {pronunciation.jp_tone !== pronunciation.my_tone ?
                                            (pronunciation.my_tone.split('/').some(part => part === pronunciation.jp_tone) ?
                                                <GreenHighlight>{pronunciation.jp_tone}</GreenHighlight> :
                                                <Highlight>{pronunciation.jp_tone}</Highlight>) :
                                            pronunciation.jp_tone}
                                    </Typography>
                                    <Typography sx={{ lineHeight: '1.5' }} variant="h6">{pronunciation.hanzi}</Typography>
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                </ClickAwayListener>


            </Box>


        </Container>
    );
}
