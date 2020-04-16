# Untitled Knight API

> You Ale-Soused Apple John! But that is a shrewd and valorous idea!

---

## Description

Translates boring, everyday ~~heretical~~ language into the proper way of speaking as a glorious knight!

---

## Endpoints

### `/translations`
#### Returns a list of all translations available

Example output:
`/translations`
```
[
    {
        "phrase": "Yes",
        "translated": "Aye"
    },
    {
        "prase": "Ok",
        "transltaed": "God wills it"
    },
    ...
]
```

### `/translate/{word-or-dash-separated-phrase}`
#### Returns a single translation. Case insensitive

Example output:
`/translate/i-feel-sick`
```
{
    "phrase": "I feel sick",
    "translated": "By my troth! A plague is upon me!"
}
```

### `/random`
#### Returns a random translation

Example output:
`/random`
```
{
    "phrase": "I'm better than you",
    "translated": "I'm no hedge-born knave, tis true!"
}
```
