import {isDevMode} from "@angular/core"
export const CONFIG={
    apiUrl:isDevMode()?'/api':'http://neuron.sparker.top'
};
