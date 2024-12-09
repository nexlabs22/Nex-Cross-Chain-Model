export type rawStakeDataType = {                   
    user: string;                 
    tokenAddress: string;         
    amount: bigint;               
    totalStakedAmount: bigint;    
    poolSize: bigint;             
    vault: string;                
    sharesMinted: bigint;         
    timestamp: bigint;            
    blockNumber: bigint;          
    blockTimestamp: bigint;       
    transactionHash: string;      
};

export type LeaderBoardDataType = {
    user: string;
    timestamp: number,
    totalStakeAmount: number,
    userPoolSharePercentage: number,
    rewardAmount: number
    lastActivityString: string
}

export type StakingChartType = {
    time: number,
    value: number
}