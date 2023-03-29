const fs = require("fs-extra")

const generate = async() => {
    let config = null;
    let all_metadata = []

    if (!fs.existsSync("./meta-config.json")) {
        console.log("File meta-config.json doesn't exist.")
        process.exit()
    } else {
        config = JSON.parse(await fs.readFile("./meta-config.json", "utf-8"))
    }

    const fillTemplate = function(templateString, templateVars) {
        return new Function("return `" + templateString + "`;").call(templateVars);
    }

    for (i = 1; i <= 60; i++) {
        const templateVarsForName = {
            id: i
        }
        let name = fillTemplate(config.name, templateVarsForName);
        let description = config.description;
        var obj = { id: i, name: name, description: description, image: config.image, attributes: config.attributes, compiler: config.compiler };
        all_metadata.push(obj)
        await fs.writeFile(`./metadata/${i}.json`, JSON.stringify(obj), "utf-8"),
            function(err) {
                if (err) throw err;
                console.log('completed');
            }
    }
    await fs.writeFile("./all.json", JSON.stringify(all_metadata), "utf-8");
}

generate()