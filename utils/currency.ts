

export const format = ( value: number ) => {
  
    //Crear formateador

    const formater = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    return formater.format( value );

}