export class command {
    cm:any
    manage:Map<String,Array<Function>>
    constructor() {
        this.manage = new Map();
    }
    private init(){
        
    }
    add(key,value){
        this.manage.set(key,value);
    }
    exec(key){

    }
}