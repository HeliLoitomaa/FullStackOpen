:::mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser:  HTTP POST ‑pyyntö osoitteeseen new_note
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    
    activate server
    server-->>browser: Palvelin lisää uuden objektin listaan ja uudelleenohjaa (302) osoitteeseen /notes
    deactivate server

    browser->>server: sivun uudelleenlataus GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML dokumentti
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: css tiedosto
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript tiedosto
    deactivate server
    
    Note right of browser: Selain suorittaa javascriptin, joka pyytää JSON-muotoisen datan palvelimelta
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "Note 1", "date": "2024-1-1" }, ... ]
    deactivate server    

    Note right of browser: Selain suorittaa funktion, joka renderöi listan muistiinpanoja JSON-datasta, lisätty  muistiinpano on nyt mukana

:::