export class Helper{


    static title="我是全局的title";

    static substring(str:string,start:number,end:number){

            if(end){
                return str.substring(start,end);
            }else{
                return str.substring(start);
            }
    }

}