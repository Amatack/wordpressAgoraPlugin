export async function totalTrades(agora, tokenId){
    const parametrosDeBusqueda = {
        type: 'TOKEN_ID',
        tokenId: tokenId,
        table: 'HISTORY',
    }

    const myHistoricOffers = await agora.historicOffers(parametrosDeBusqueda,0,10)
    let totalSalesMultiplied = myHistoricOffers.offers.filter(obj => obj.status === 'TAKEN').length;

    for (let n=1; n < myHistoricOffers.numPages; n++){
        const myHistoricOffers = await agora.historicOffers(parametrosDeBusqueda, n, 10)
        let groupSales = myHistoricOffers.offers.filter(obj => obj.status === 'TAKEN').length;
        totalSalesMultiplied += groupSales
    }
    let totalSales = totalSalesMultiplied /4
    return totalSales
}