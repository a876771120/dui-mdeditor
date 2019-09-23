export class command {
    cm:any
    manage:Map<String,Function>
    constructor(cm) {
        this.cm = cm;
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