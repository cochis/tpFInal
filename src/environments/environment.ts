// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  user_ID: '64ff4f79da409a7d91056a5b',
  secret: '1f2d1e2e67df',
  version: "1.2.0.0",
  publicKey: "BJqZ8KY_kguwLf27SsteILLRHlWY2pJOvrKlyZNeFlEg4O15ut0t7oYMgXHcLPSh2WYCRPwTS3WEPnhXCMZO4Wg",
  privateKey: "v04F9j6-aAZRvYl25BtZu1cezaWT-m4P0sHtE0JbE7g",
  stripeKeyD: 'pk_test_51PipskAbE4XYrXNxNi1oiwylWr7B9mNMfUfQ070Cy09dDPj5HBFYObSajMGjNzlAynX23dT8thcx8sdJxpnP7Vov00wzIocDLR',
  stripeKeyP: 'pk_live_51PipskAbE4XYrXNxZ0yWqN3yzqmd10zuGlQfrTjw5Xq6qJKieygAzLP82XsSdLC108X9U6fpR7JesWItmvnQBv2H00fBlsrNTw',
  //DEV
  //base_url: "http://localhost:3008/api",
  //text_url: "http://localhost:4200/",
  //QA
  //base_url: "https://tickets.cochisweb.com/api",
  //text_url: "https://tickets.cochisweb.com/",
  //PROD
  base_url: "https://www.myticketparty.com/api",
  text_url: "https://www.myticketparty.com/",
  //   PARAMETROS
  urlInvitacion: 'https://tickets.cochisweb.com/core/templates/default/67004d6552152ca21abfb790/670b203aeb2ab02d2eb494e2',
  urlInvitacionFile: 'https://tickets.cochisweb.com/core/templates/byFile/67006e4d81d8c3a51137cdd7/670b2eadeb2ab02d2eb49670',
  admin_role: 'ADMROL',
  salon_role: 'SLNROL',
  user_role: 'USRROL',
  anf_role: 'ANFROL',
  chk_role: 'CHCROL',
  EVTRGL: 'EVTRG',
  INCSC: 'INCSC',
  ESLTC: 'ESLTC',
  PROSC: 'PROSC',
  PAGSC: 'PAGSC',
  VGFSC: 'VGFSC',
  EVPSC: 'EVPSC',
  CANTIDADFIESTAS: 'FSGPR',
  CANTIDADGALERIAS: 'GSGPR',
  SETTIME: 'STTMOU',
  PRMTCE: "PRMTCE",    // Colegio
  ESCTCE: "ESCTCE",  // Escuela de baile
  SLETCE: "SLETCE",  // Salon de eventos
  mapsGoogleUrl: "https://www.google.com/maps",
  mapsGoogleZoom: "21",
  examples: [
    '670ace12e52f97e35908191c|https://www.myticketparty.com/core/templates/default/670ace12e52f97e35908191c/67268e8513060646af5822ec|Hallowen|default',
    '6726ded413060646af5825ca|https://www.myticketparty.com/core/templates/byFile/6726ded413060646af5825ca/6727275eccbd48678e4b65a9|Fin de año|byFile',
    '6726e81913060646af5826a9|https://www.myticketparty.com/core/templates/default/6726e81913060646af5826a9/6726f2f813060646af58294d|Boda|default',
    '6727c012ccbd48678e4b6e39|https://www.myticketparty.com/core/templates/default/6727c012ccbd48678e4b6e39/6727c24cccbd48678e4b7048|Junta de padres de familia|default',
    '6727c75cccbd48678e4b740d|https://www.myticketparty.com/core/templates/default/6727c75cccbd48678e4b740d/6727ca03ccbd48678e4b767c|Bautizo|default',
    '6727cacbccbd48678e4b786d|https://www.myticketparty.com/core/templates/default/6727cacbccbd48678e4b786d/6727edc6ccbd48678e4b8643|Clausura de ciclo|default',
    '6727cf9dccbd48678e4b79c8|https://www.myticketparty.com/core/templates/default/6727cf9dccbd48678e4b79c8/6727eeaaccbd48678e4b8809|Aniversario|default',
    '6727d2dbccbd48678e4b7b2b|https://www.myticketparty.com/core/templates/default/6727d2dbccbd48678e4b7b2b/6727d886ccbd48678e4b7e94|Deportivo|default'
  ],
  cPrimary: '#13547a',
  cSecond: '#80d0c7',
  cProvedores: [
    {
      value: "679a73e437dec3f0672e2ec1",
      clave: "cPrincipalWP"
    },
    {
      value: "679a744737dec3f0672e2ece",
      clave: "cSecondWP"
    },
  ],
  tiProducto: '679ba1e689b67b7d7fb5a902',
  tiServicio: '679ba20189b67b7d7fb5a909',
  contactosProveedor: [
    {
      value: "679a6850217a76f8b6b650d8",
      clave: "TELÉFONO"
    }
    ,
    {
      value: "679a6a7b9fb2c32e86079b8d",
      clave: "MAIL"
    },
    {
      value: "679a6a7b9fb2c32e86079b8d",
      clave: "MAIL"
    },
    {
      value: "679a6b3a9fb2c32e86079ba3",
      clave: "DIRECCIÓN"
    },
    {
      value: "679a6d03d7603c6c58018354",
      clave: "PAGINA WEB"
    },
  ]

};
