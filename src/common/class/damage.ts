export class Damage {
    strengthMin: number; 
    strengthMax: number; 
    strengthAvg: number; 
    strengthMinByTP: number; 
    strengthMaxByTP: number; 
    strengthAvgByTP: number; 
    poisonMin: number;
    poisonMax: number;
    poisonAvg: number;
    poisonMinByTP: number;
    poisonMaxByTP: number;
    poisonAvgByTP: number;
    novaMin: number;
    novaMax: number;
    novaAvg: number;
    novaMinByTP: number;
    novaMaxByTP: number;
    novaAvgByTP: number;
    totalMin: number; 
    totalMax: number; 
    totalAvg: number; 
    totalMinByTP: number; 
    totalMaxByTP: number; 
    totalAvgByTP: number; 

    constructor(
        strengthMin: number = 0,
        strengthMax: number = 0,
        strengthAvg: number = 0,
        strengthMinByTP: number = 0,
        strengthMaxByTP: number = 0,
        strengthAvgByTP: number = 0,
        poisonMin: number = 0,
        poisonMax: number = 0,
        poisonAvg: number = 0,
        poisonMinByTP: number = 0,
        poisonMaxByTP: number = 0,
        poisonAvgByTP: number = 0,
        novaMin: number = 0,
        novaMax: number = 0,
        novaAvg: number = 0,
        novaMinByTP: number = 0,
        novaMaxByTP: number = 0,
        novaAvgByTP: number = 0,
        totalMin: number = 0,
        totalMax: number = 0,
        totalAvg: number = 0,
        totalMinByTP: number = 0,
        totalMaxByTP: number = 0,
        totalAvgByTP: number = 0
    ) {
        this.strengthMin = strengthMin;
        this.strengthMax = strengthMax;
        this.strengthAvg = strengthAvg;
        this.strengthMinByTP = strengthMinByTP;
        this.strengthMaxByTP = strengthMaxByTP;
        this.strengthAvgByTP = strengthAvgByTP;
        this.poisonMin = poisonMin;
        this.poisonMax = poisonMax;
        this.poisonAvg = poisonAvg;
        this.poisonMinByTP = poisonMinByTP;
        this.poisonMaxByTP = poisonMaxByTP;
        this.poisonAvgByTP = poisonAvgByTP;
        this.novaMin = novaMin;
        this.novaMax = novaMax;
        this.novaAvg = novaAvg;
        this.novaMinByTP = novaMinByTP;
        this.novaMaxByTP = novaMaxByTP;
        this.novaAvgByTP = novaAvgByTP;
        this.totalMin = totalMin;
        this.totalMax = totalMax;
        this.totalAvg = totalAvg;
        this.totalMinByTP = totalMinByTP;
        this.totalMaxByTP = totalMaxByTP;
        this.totalAvgByTP = totalAvgByTP;
    }
}