List/array iteration (value only)
```slang
sangas is esky: bloody ham, bloody cheese, bloody salad.

scoffin the tucker from sangas!
crikey - tucker.
who's full?
```

```pseudo
food = ["ham", "cheese", "salad"]

for x in food:
  print(x)
end

```pass the parcel, flamin bagpipes!
crikey - the parcel.
who's got it?
```

```pseudo
for the_parcel in range(8):
  print(the_parcel)
```

- "pass the parcel" loop, "flamin bagpipes" int 8 - loop 8 times.
- allow whitespace in variables naturally (using keywords, or full stops as boundaries.)
- "who's got it?" ends the loop.

```slang
age is flamin oldmate.
weight is spewin dropbear.

crikey - grab age from idcard.
suss if weight is flamin fat.
```

```pseudo
age = int 7
weight = float 8
print (idcard['age'])

assert weight != 3
```

- derive int or float value from string length (flamin, spewin)
- "grab" keyword for dictionary/arry key lookup.
- "suss" for inverted assertions.

```slang
goodies is esky: bloody beer, bloody chips, blooding lamington.

Another shrimp in goodies - bloody pavlova.

Ditch bloody chips from goodies.

snacks is sheepshear goodies from flamin beer in flamin pavlova.

drop the last snag from goodies.
drop the first snag from goodies.

goodies is empty.
```

```pseudo
goodies = ["beer", "chips", "lamington"]

goodies.append("pavlova")
goodies.remove("chips")

snacks = goodies[1:3]

goodies.pop()
goodies.pop(0)

goodies = []
```

- "esky" as list keyword.
- "sheepshear from __ to __" as list slicing.
- "drop the last" as popping the last value.
- "drop the first" as popping the first value.

```slang
menu is tuckshop: pies is 5, sauce is tomato, roll is 3.

dealin from menu!
crikey - the item and the price.
who's full?
```

```psuedo
menu = {pies: 5, sauce: "tomato", roll: 3}

for k, v in menu.items():
  print(k, v)
```

- "tuckshop" as dictionary/array keyword.
- comma separated assignment. Should support whitespace variables. Use punctuation to separate.
- "dealin from menu" iterate dict keyword.
- "the item" built-in variable for current iteration key.
- "the price" built-in variable for current iteration value.
- "who's full?" end iteration block.

```slang
chuck in sqrt from math.
chuck in the lot from time.
chuck in numpy - mates call it numbers.
```

- Import statements.
- "chuck in __ from __" = from x import y.
- "chuck in the lot from ___" = from x import * (maybe not relevant to JS)
- "mates call it" import aliasing.

```slang
goodies is esky: bloody pies, bloody snags, bloody sauce.

grab 0 from goodies.
```

```pseudo
goodies = ["pies", "snags" "sauce"]
goodies[0]
```

- Access elements from a list with "grab" and index.

```slang
tuckshop is tuckshop: pies is 5, sauce is "tomato".
grab sauce from tuckshop.
```

- Access dictionary value by key with same "grab" keyword.

```slang
til bag is empty.
crikey - still goin.
fully sick.
```

```pseudo
while bag:
  print("still goin")
```

- explicit "empty" type for arrays/dicts, lists.
- "til = inverted "while" loop.
- "fully sick" as end to til loop.

```
G'day.

Pies is flamin 5.
Sauce is bloody tomato.
Ratio is spewin 1.75

Menu is tuckshop: pies, sauce, ratio.

if grab menu at pies biggerthan flamin 3, 
  crikey - you've got enough snags.
otherwise, 
  crikey - better head to woolies.

Make tracks.
```

- Optional "G'day."
- "biggerthan" and "smallerthan" as > and < operators.
- "if", "or if", "otherwise" and "make tracks" (if, elif, else, fi)

```slang
Prep fibo barbie with limit:
  fibs is esky: 0, 1.
  
  every num in flamin limit minus 2:
    next is fibs sheepshear -1 plus fibs sheepshear -2.
    fibs top up next.
  deal fibs.

Gimme count.
suss if count is nothin:
  bugger - need a number mate.

fibs is flamin fibo with count.
crikey - bloody fibs.
```

- Fibonnaci example.
- "Sheepshear" slicing keyword.
- "Prep fibo barbie with limit" = def fibo (limit)
- "every num" = for loop with index, limit and step.
- "flamin" typing keywords can be used unnecessarily to typecast variables at any time. Even if already correctly typed, just for fun.
- "bugger" - Raise a generic exception.
- "deal" return
- "plus", "minus" +, - operators.
- "top up" append to array/list.
- "Gimme count" count = read stdin.

---

smoko = time.sleep()
oi = + " " + concatenate with whitespace.
straya = block comment