export async function totalTrades(agora, tokenId){
    const parametrosDeBusqueda = {
        type: 'TOKEN_ID',
        tokenId: tokenId,
        table: 'CONFIRMED',
    }

    const myHistoricOffers = await agora.historicOffers(parametrosDeBusqueda,0,10)
    let totalSales = myHistoricOffers.offers.filter(obj => obj.status === 'TAKEN').length;

    for (let n=1; n < myHistoricOffers.numPages; n++){
        const myHistoricOffers = await agora.historicOffers(parametrosDeBusqueda, n, 10)
        let groupSales = myHistoricOffers.offers.filter(obj => obj.status === 'TAKEN').length;
        totalSales += groupSales
    }

    return totalSales
}