export default class i18n {
    langManage:language
    constructor(lang:language) {
        this.langManage = lang
    }
    get(){

    }
    set(){

    }
    has(){

    }
}
interface language{
    name:String,//语言包名称
    options:langmap
}

interface langmap{
    key:String
    value:String
    children?:langmap
}