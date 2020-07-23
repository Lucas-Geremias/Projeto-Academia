const fs = require('fs')
const data = require('./data.json')
const {age} = require('./utils')

//show mostrar
exports.show = function(req, res){
    const { id } = req.params

    const foundIsntructor = data.instructors.find(function(instructor){
        return id == instructor.id
    })

    if(!foundIsntructor) return res.send("Instructor not found!")

    const instructor = {
        ...foundIsntructor,
        age: age(foundIsntructor.birth),
        services: foundIsntructor.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundIsntructor.created_at),
        
    }
    return res.render("instructors/show", { instructor})
}

//create
exports.post = function(req,res){
    const keys = Object.keys(req.body)
    
    for(key of keys){
        if(req.body[key] == ""){
            return res.send('Please, fill all fields!')
        }
    }

    let {avatar_url, birth, name, services, gender} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)


    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,
    })

    fs.writeFile("data.json",JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("write file err")
        return res.redirect("/instructors")
    })


   //return res.send(req.body)
}

//edit
exports.edit = function(req,res){

    return res.render('instructors/edit',{})
}
