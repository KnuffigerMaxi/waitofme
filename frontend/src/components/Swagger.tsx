import React from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

function MySwaggerUI() {
    const swaggerUrl = 'https://petstore.swagger.io/v2/swagger.json'

    return <SwaggerUI url={swaggerUrl} />
}

export default MySwaggerUI
