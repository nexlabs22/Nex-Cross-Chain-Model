const fields = [
    { field: 'time', smartContractTypes: ['defi', 'crosschain', 'stocks'] },
    { field: 'user', smartContractTypes: ['defi', 'crosschain', 'stocks'] },
    { field: 'transactionHash', smartContractTypes: ['defi', 'crosschain', 'stocks'] },
    { field: 'inputAmount', smartContractTypes: ['defi', 'crosschain', 'stocks'] },
    { field: 'outputAmount', smartContractTypes: ['defi', 'crosschain', 'stocks'] },
    { field: 'nonce', smartContractTypes: ['crosschain', 'stocks'] },
    { field: 'messageId', smartContractTypes: ['crosschain'] },
    { field: 'blockTimestamp', smartContractTypes: ['stocks'] },
];

const baseEntities = {
    issuance: "issuanceds",
    redemption: "redemptions",
    requestIssuance: "requestIssuances",
    requestRedemption: "requestRedemptions",
    issuanceCancelled: "issuanceCancelleds",
    requestCancelIssuance: "requestCancelIssuances",
    redemptionCancelled: "redemptionCancelleds",
    requestCancelRedemption: "requestCancelRedemptions",
  };
  
  const contractTypeToEntities: Record<string, string[]> = {
    defi: [baseEntities.issuance, baseEntities.redemption],
    crosschain: [baseEntities.issuance, baseEntities.redemption, baseEntities.requestIssuance, baseEntities.requestRedemption],
    stocks: [
      baseEntities.issuance,
      baseEntities.redemption,
      baseEntities.issuanceCancelled,
      baseEntities.requestIssuance,
      baseEntities.requestCancelIssuance,
      baseEntities.redemptionCancelled,
      baseEntities.requestRedemption,
      baseEntities.requestCancelRedemption,
    ],
  };
  
  const formatEntityName = (index: string, entity: string) => {
    const capitalizeFirst = /\d$/.test(index); // Ends with a numeral?
    return `${index}${capitalizeFirst ? entity.charAt(0).toUpperCase() + entity.slice(1) : entity}`;
  };

  export {fields, formatEntityName, contractTypeToEntities}