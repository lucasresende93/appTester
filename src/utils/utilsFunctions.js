export function intToHex(value) {

    return hexString = value.map(b => b.toString(16).padStart(2, '0')).join(', ');
}

export function calcData(data) {
    const pulsoHigh = (data[4] << 8) | data[5];
    const pulsoLow = (data[6] << 8) | data[7];
    const temperatura = (((pulsoLow - 1000) * 41.25) / 1000) - 40;

    const ethanol = 1000000 / (pulsoHigh + pulsoLow) - 50;
    return{
        ethanol: ethanol,
        temperatura: temperatura
    }
}
