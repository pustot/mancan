import { CssBaseline, PaletteMode } from "@mui/material";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import "purecss/build/pure.css";
import * as React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./styles.scss";

import NavBarAndMenu, { NavItem } from "./components/NavBarAndMenu";
import { I18nText } from "./utils/I18n";
import About from "./pages/About";
import Home from "./pages/Home";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FeedIcon from "@mui/icons-material/Feed";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import Footer from "./components/Footer";

export default function App() {
    // Prepare global states: 
    // `lang` for I18n languages
    // `theme` for color themes (dark or light)
    const [lang, setLang] = React.useState<keyof I18nText>(
        (localStorage.getItem("pustot/0.1/lang") as keyof I18nText) || ("en" as keyof I18nText)
    );

    const systemColor: string =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const [mode, setMode] = React.useState<string>(localStorage.getItem("pustot/0.1/mode") || systemColor);
    const toggleColorMode = () => {
        localStorage.setItem("pustot/0.1/mode", mode === "light" ? "dark" : "light");
        setMode(prevMode => (prevMode === "light" ? "dark" : "light"));
    };

    const theme: Theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode as PaletteMode,
                },
            }),
        [mode]
    );

    const langSetter = (tar: keyof I18nText) => {
        setLang(tar);
    };

    // Prepare items and subpages used in NavBar, SideDrawer and Footer
    const title: I18nText = {
        "zh-Hans": "普通粤",
        "zh-Hant": "普通粵",
        "en": "Mancan",
        "ja": "Mancan",
        "de": "Mancan",
        "ko": "Mancan",
        "ko-Han": "Mancan",
        "eo": "Mancan",
        "fr": "Mancan",
        "vi": "Mancan",
        "vi-Han": "Mancan",
        "es": "Mancan",
        "tto-bro": "Mancan",
        "tto": "Mancan",
    };

    const navItems: NavItem[] = [
        {
            name: {
                "zh-Hant": "首頁",
                "zh-Hans": "首页",
                "en": "Home",
                "ja": "ホーム",
                "de": "Startseite",
                "ko": "대문",
                "ko-Han": "大門",
                "eo": "Ĉefpaĝo",
                "fr": "Accueil",
                "vi": "Trang chủ",
                "vi-Han": "張主",
                "es": "Inicio",
                "tto-bro": "6dn2X8aL",
                "tto": "XoV",
            },
            link: "/",
            icon: <HomeIcon />,
        },
        {
            name: {
                "eo": "HanPoli",
                "zh-Hant": "漢諸",
                "zh-Hans": "汉诸",
                "en": "HanPoly",
                "tto-bro": "XrH3Tei",
                "tto": "XrHhoSe",
            },
            link: "https://hanpoly.pustot.com/",
            icon: <img style={{ width: '24px', height: 'auto' }} src={"https://pustot.github.io/public/index/pic/logo-hanpoly.webp"} alt="My Image" />,
        },
        {
            name: {
                "eo": "Kantona Memkartaro",
                "zh-Hant": "粵語字卡",
                "zh-Hans": "粤语字卡",
                "en": "Cantonese Flashcard",
                "tto": "vmv ARD",
            },
            link: "https://cantonese-flashcard.pustot.com/",
            icon: <img style={{ width: '24px', height: 'auto' }} src={"https://pustot.github.io/public/index/pic/logo-cantonese-flashcard.webp"} alt="My Image" />,
        },
        {
            name: {
                "eo": "Vortaro Konsulto",
                "zh-Hant": "查詞",
                "zh-Hans": "查词",
                "en": "Word Lookup",
            },
            link: "https://word-lookuper.pustot.com/",
            icon: <img style={{ width: '24px', height: 'auto' }} src={"https://pustot.github.io/public/index/pic/logo-word-lookuper.webp"} alt="My Image" />,
        },
        {
            name: {
                "zh-Hant": "關於",
                "zh-Hans": "关于",
                "en": "About",
                "ja": "私について",
                "de": "Über Mich",
                "ko": "나에 대해서",
                "ko-Han": "나에 對해서",
                "eo": "Pri mi",
                "fr": "À propos de moi",
                "vi": "Về tôi",
                "vi-Han": "𡗅碎",
                "es": "Sobre mí",
                "tto-bro": "YQnrHOei",
                "tto": "aCLqSqv",
            },
            link: "https://www.pustot.com/#/about",
            icon: <InfoIcon />,
        },
        {
            name: {
                "zh-Hant": "愛",
                "zh-Hans": "爱",
                "en": "Love",
                "ja": "愛",
                "de": "Liebe",
                "ko": "사랑",
                "ko-Han": "사랑",
                "eo": "Amo",
                "fr": "L'amour",
                "vi": "Tình yêu",
                "vi-Han": "情𢞅",
                "es": "Amor",
                "tto-bro": "Oie3",
                "tto": "re",
            },
            link: "https://love.pustot.com/",
            icon: <FavoriteIcon />,
        },
    ];

    const repoLink = "https://github.com/pustot/mancan";

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>
                <NavBarAndMenu
                    theme={theme}
                    toggleColorMode={toggleColorMode}
                    lang={lang}
                    langSetter={langSetter}
                    title={title}
                    navItems={navItems}
                />

                <br />
                <br />
                <br />

                <Routes>
                    <Route path="/" element={<Home lang={lang} />} />
                    <Route path="/home" element={<Home lang={lang} />} />
                </Routes>

                <br />
                <br />

                <Footer repoLink={repoLink} theme={theme} />
            </HashRouter>
        </ThemeProvider>
    );
}
