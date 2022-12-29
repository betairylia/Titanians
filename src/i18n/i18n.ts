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
        rTree: "树木",
        rFruit: "野果",
        
        bPlantation: "种植园",
        bFarm: "农场",
        
        aGatherFruit: "收集一些野果",
    }
}

function getStrings(key: string): string
{
    return strings[getCustomInterfaceLanguage()][key] || key;
}

export {strings, getStrings};
