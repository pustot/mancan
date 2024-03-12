
const simple_mapper_initial = new Map([
    ["b", "b"], ["p", "p"], ["m", "m"], ["f", "f"],
    ["d", "d"], ["t", "t"], ["n", "n"], ["l", "l"],
    ["g", "g"], ["k", "k"], ["h", "h"],
    // ["j", ""], ["q", ""], ["x", ""],
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

const jt_mapper = new Map([
    ["j", "z/g"], ["q", "c/k"], ["x", "s/h"],
]);

// 定义转换选项
export const mancan_options = [
    { label: '尖团音', value: 'jt' },
    { label: '闭口韵（咸深）', value: 'bk' },
    { label: '阴阳上阴阳去', value: 'yy' },
    // 可以根据需要添加更多选项
    { label: '入声字', value: 'rs' },
];

export const mancan_convert = (
    py: string,
    py_initial: string,
    py_final: string,
    py_tone: string,
    selectedOptions: string[],
    jp_final: string
): [string, string, string] => {
    // simple mapping
    let my_initial = simple_mapper_initial.get(py_initial) || "";
    let my_final = simple_mapper_final.get(py_final) || "";
    let my_tone = "0";
    if (py_tone == "1") my_tone = "1";
    else if (py_tone == "2") my_tone = "4";
    // simple mapping: for beginning y and w and gu ku
    if (my_initial == "" && py[0] == "y") my_initial = "j";
    if (my_initial == "" && py[0] == "w" && py.substring(0, 4) !== "weng") my_initial = "w";
    if (my_initial === "g" && py.substring(0, 2) === "gu") my_initial = "gw";
    if (my_initial === "k" && py.substring(0, 2) === "ku") my_initial = "kw";

    // Options

    // 最基本的逻辑，放最下面
    // 尖团音
    if (selectedOptions.includes('jt') && !my_initial) {
        my_initial = jt_mapper.get(py_initial) || my_initial;
    }
    // 闭口韵（咸深）
    if (selectedOptions.includes('bk') && (my_final.endsWith("m") || my_final.endsWith("n"))) {
        my_final = my_final.slice(0, -1) + "m/" + my_final.slice(0, -1) + "n";
    }
    // 入声字
    if (selectedOptions.includes('rs') && /[ptk]$/.test(jp_final)) {
        my_final = "/" + jp_final;
    }
    // 阴阳上阴阳去
    if (selectedOptions.includes('yy') && (py_tone == "3" || py_tone == "4")) {
        if (py_tone == "3") my_tone = "2/5";
        if (py_tone == "4") my_tone = "3/6";
    }
    console.log(jt_mapper.get(py_initial))
    return [my_initial, my_final, my_tone];
}