import LocalizedStrings from 'localized-strings'

export function getCustomInterfaceLanguage() 
{
    return "zh";
}

type i18nDictionary = { [index: string]: string }

let strings:Record<string, i18nDictionary> = {
    en: {
        rFruit: "Wild fruits",
    },
    zh: {
        tick: "刻",
        sec: "秒",
        min: "分",

        rOak: "橡树",
        rPicea: "云杉",
        rShrub: "灌木丛",
        rGrass: "草",

        rFruit: "野果",
        rWood: "木材",
        rBranch: "树枝",
        rCulture: "文化",
        
        bPlantation: "种植园",
        bFarm: "农场",
        bLoggingCamp: "伐木场",
        bForestKeeper: "护林员小屋",
        bBonfire: "篝火堆",
        bHouse: "木屋",
        bGuild: "探险工会",
        bAtelier: "风车工房",
        bLibrary: "图书馆",
        bAcademy: "学院",
        bTheatre: "剧院",
        bMine: "矿井",
        
        aGatherFruit: "收集一些野果",
        aGatherBranch: "收集一些树枝"
    }
}

function getStrings(key: string): string
{
    return strings[getCustomInterfaceLanguage()][key] || key;
}

export {strings, getStrings};
