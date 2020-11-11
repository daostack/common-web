# Proposals

`/proposals/create/join`
    
- Expected body
```
    "commonId": string uuid
    "description": string
    "funding": number (in cents)
```
  
`/proposa/create/funding`
```
    "commonId": string uuid
    "description": string
    "amount": number (in cents)
```

`proposals/create/vote`

```
    "outcome": "approved" | "rejected",
    "proposalId": string uuid
```