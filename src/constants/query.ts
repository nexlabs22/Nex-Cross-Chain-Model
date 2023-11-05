function QueryCommaSplit(tableName: string, columnName: string) {

    return `
    SELECT stampsec AS time,
           CASE
               WHEN strpos(${columnName}, ',') > 0 THEN SPLIT_PART(${columnName}, ',', 1)
               ELSE ${columnName}
           END AS open,
           CASE
               WHEN strpos(${columnName}, ',') > 0 THEN SPLIT_PART(${columnName}, ',', 2)
               ELSE NULL
           END AS high,
           CASE
               WHEN strpos(${columnName}, ',') > 0 THEN SPLIT_PART(${columnName}, ',', 3)
               ELSE NULL
           END AS low,
           CASE
               WHEN strpos(${columnName}, ',') > 0 THEN SPLIT_PART(${columnName}, ',', 4)
               ELSE NULL
           END AS close
    FROM ${tableName}
    WHERE to_timestamp(stampsec) > (CURRENT_TIMESTAMP - INTERVAL '6 year')
    AND (strpos(${columnName}, ',') > 0 OR LENGTH(REGEXP_REPLACE(${columnName}, '[^0-9.]', '', 'g')) > 0);
    `
}

function QueryforIndex(tableName: string, columnNames: string) { 
    return `
    SELECT 
        stampsec AS time,
        ${columnNames}
    FROM ${tableName}
    WHERE to_timestamp(stampsec) > (CURRENT_TIMESTAMP - INTERVAL '6 year')
    AND (
        LENGTH(REGEXP_REPLACE(dow, '[^0-9.]', '', 'g')) > 0
        OR LENGTH(dow) > 0 
    );`
}

export default QueryCommaSplit;
export {QueryforIndex};