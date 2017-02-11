export class RepoBrief {
    id: number;
    name: string;
    amount: number;
}

export class RepoDetail extends RepoBrief{
    words:any[];
    hash:any={};
    doHash(){
        for (let i = 0; i < this.words.length; i++) {
            this.hash[this.words[i]]=true;
        }
    }
    constructor (repo:any,needHash:boolean){
        super();
        this.id=repo.words;
        this.name=repo.name;
        this.amount=repo.amount;
        this.words=repo.words;
        if (needHash) {
            for (let i = 0; i < this.words.length; i++) {
                this.hash[this.words[i]]=true;
            }
        }
    }
}
