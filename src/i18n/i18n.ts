import LocalizedStrings from 'localized-strings'

export function getCustomInterfaceLanguage() 
{
    return "zh-CN";
}

let strings = new LocalizedStrings({
    en: {
        rFruit: "Wild fruits",
    },
    zh: {
        rFruit: "野果",
        
        bPlantation: "种植园",
        
        sGatherFruit: "收集一些野果",
    }},
    {
        customLanguageInterface: getCustomInterfaceLanguage
    }
);

export {strings};
