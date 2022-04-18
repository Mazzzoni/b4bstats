# Riddens

This directory contains every data related to riddens statistics, you can find every difficulty in their respective directory.

## How to change difficulty notes

Notes are stored in `note.md` file, format used is [**markdown**](https://www.markdownguide.org/cheat-sheet/), this way you can stylize texts and integrate customized elements into each difficulty notes.  
You can use a text editor or [online editor](https://markdownlivepreview.com/) to modify these files easily.

*(this file itself is written in markdown, you can check its source to see the syntax)*

## How to change riddens statistics

Riddens statistics are stored in `riddens.json` file, format used is [**JSON**](https://en.wikipedia.org/wiki/JSON), this format allows you to easily edit riddens data and keep a structured format that can be used by the app.  
It works with `keys` (on left) and `values` (on right), here's an example:

```json
{
  "key": "value",
  "some_number": 3,
  "this_is_an_object": {
    "more_key": 3.1415,
    "a_boolean": true,
    "another_boolean": false
  }
}
```

### Ridden format

Each ridden are declared in this manner, here's example for `Tallboy` ridden:

```json
{
  "name": "Tallboy",
  "category": "tallboys",
  "image": "tallboy.webp",
  "health": {
    "Standard": 725.7,
    "Ferocious": 907.1,
    "Monstrous": 1088.5
  },
  "weakspot_multiplier": 2,
  "stumble": {
    "health": 250,
    "recovery": 90,
    "weakspot_multiplier": 2
  }
}
```

Not all keys are required, you can omit most of them, do **not** add new keys on the fly, or modify key name.   
Here's a breakdown explaining every key

| key                 | required | type of value                                                                                                                                         |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                | yes      | string                                                                                                                                                |
| category            | yes      | string, category of the ridden, **MUST BE** one of these values: commons / stingers / reekers / tallboys / specials / bosses                          |
| image               | yes      | string, filename of the image of the ridden (image must be available in `public/images/riddens/` directory)                                           |
| health              | yes      | health of the ridden, can be either a number (see `Sleeper` ridden) or an object that associate name to health (see `Tallboy` ridden)                 |
| note                | no       | string, any special note concerning the ridden                                                                                                        |
| weakspot_multiplier | no       | number                                                                                                                                                |
| stumble             | no       | object, sub key `health` is either a number (see `Tallboy`) or string (see `Ogre`), sub key `recovery` is a number, `weakspot_multiplier` is a number |
| weakspot_back       | no       | object, sub key `health` is a number, `weakspot_multiplier` is a number, `body_damage` is a number                                                    |
| weakspot_chest      | no       | object, sub key `health` is a number, `weakspot_multiplier` is a number, `body_damage` is a number                                                    |
| weakspot_legs       | no       | object, sub key `health` is a number, `weakspot_multiplier` is a number, `body_damage` is a number                                                    |
| weakspot_head       | no       | object, sub key `health` is a number, `weakspot_multiplier` is a number, `body_damage` is a number                                                    |
| weakspot_body       | no       | object, sub key `health` is a number, `weakspot_multiplier` is a number, `body_damage` is a number                                                    |

## Submit modification

You can either make a `pull request` to this repository (if you're a dev) or copy files locally, edit them and send it back to me, so I can update app.

In case of doubts, you can check already implemented riddens, or you can ask questions on Discord ! :)