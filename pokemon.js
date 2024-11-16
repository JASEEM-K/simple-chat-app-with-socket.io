const fs = require('fs');

const poke=async () => {
try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/mareep');
    const data = await res.json();
    if(!res.ok)throw new Error(data.message);
    fs.writeFileSync('pokemon.json',JSON.stringify(data));
    console.log(data);
} catch (error) {
    console.error(error);
}
}

poke();