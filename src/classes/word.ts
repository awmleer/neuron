import * as moment from "moment";

// export class WordRecord {
//     word:string;
//     proficiency:number;//range from 0 to 8
//     addTime:number;
//     wait:number=0;
//     constructor (word:string, proficiency:number){
//         this.word=word;
//         this.proficiency=proficiency;
//         this.addTime=moment().valueOf();
//     }
// }

export class WordRecord {
    proficiency:number;//range from 0 to 8
    addTime:number;
    wait:number=0;
    constructor (proficiency:number){
        this.proficiency=proficiency;
        this.addTime=moment().valueOf();
    }
}


export class WordEntry{
    word:string;
    level:number;
    definitions:{
        type:string;
        text:string;
    }[];
    phonetic:{
        UK:{
            sound:{
                female:string;
                male:string;
            },
            symbol:{
                female:string;
                male:string;
            }
        },
        US:{
            sound:{
                female:string;
                male:string;
            },
            symbol:{
                female:string;
                male:string;
            }
        }
    };
    sentences:string[];
}
