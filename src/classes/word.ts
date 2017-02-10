export class WordRecord {
    word:string;
    proficiency:number;
    add_date:number;
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
