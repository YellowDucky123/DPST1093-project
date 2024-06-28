let a = [
    {k: 1,
     l: 1
    },
    {
        k:2,
        l:2
    }
]

for(const d of a) {
    if(d.k == 1) {
        d.k = 4
    }
}

console.log(a)