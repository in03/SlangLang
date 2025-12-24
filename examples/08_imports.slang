oi Test: Import Statements
oi This demonstrates various import patterns in SlangLang

Crikey! "=== Import Statements Test ==="

oi Named import from a module
chuck in sqrt from math.

oi Use the imported function
result is howbout sqrt with 16.
Crikey! bloody Square root of 16 is: mate.
Crikey! result

oi Wildcard import (import everything)
chuck in the lot from fs.

oi Use something from the wildcard import
Crikey! bloody File exists check: mate.
exists_sync_func is grab existsSync from fsmodule
Crikey! howbout exists_sync_func with "examples/01_primitives.slang"

oi Module import with alias
chuck in path – mates call it pathlib.

oi Use the aliased module
resolve_func is grab resolve from pathlib
current_dir is howbout resolve_func with ".".
Crikey! bloody Current directory: mate.
Crikey! current_dir

Crikey! "All import tests completed!"