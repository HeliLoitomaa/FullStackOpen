:::mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Selain pyytää html-sivun
    browser->>server:  GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML dokumentti
    deactivate server
    
    Note right of browser: Selain pyytää html:ssa määritetyn css-tiedoston
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: css tiedosto
    deactivate server
    
    Note right of browser: Selain pyytää html:ssa määritetyn javascript-tiedoston
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript tiedosto
    deactivate server
    
    Note right of browser: Selain suorittaa javascriptin, joka pyytää JSON-muotoisen datan palvelimelta
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "Note 1", "date": "2024-1-1" }, ... ]
    deactivate server    

    Note right of browser: Selain suorittaa funktion, joka renderöi JSON-datasta muistiinpanolistan

:::