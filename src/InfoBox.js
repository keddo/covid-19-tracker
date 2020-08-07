import React from 'react'
import './InfoBox.css'
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({title, cases,casesType ,active ,total, ...props}) {
    return (
        <Card className={`infoBox ${active && 'infoBox--'+ casesType +'-selected'}`} onClick={props.onClick}>
            <CardContent >
                <Typography  className="infoBox__title"color='textSecondary'>
                    { title }
                </Typography>

                 <h2 className={`infoBox__cases ${ active && casesType === 'recovered' ? 'infoBox__cases--green' : ''}`}>{cases}</h2>
                 <Typography className="infoBox__total" color='textSecondary'>
                    { total } Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
