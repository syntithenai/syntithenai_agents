// requires config array pistonRuntimes and url pistonCodeRunnerEndpoint

export default function({runtimes, config}) {
	

	function coderunner_load_runtimes() {
		return new Promise(function(resolve,reject) {
			fetch(config.piston_url + '/runtimes', {
				method: 'GET',
				headers: {
					//'Authorization': 'Bearer '+key,
					'Content-Type': 'application/json'
				},
			}).then(function(response) {
				//console.log("load runtimes",response)
				response.json().then(function(t) {
					//console.log(t)
					resolve(t)
				})
			})
		})
	}


	

	function coderunner_run(text) {
		return new Promise(function(resolve,reject) {
			if (text) {
				let parts = text.split("```")
				if (parts.length > 1) {
					let iParts = parts[1].split("\n")
					let language = iParts[0].trim()
					let code = iParts.slice(1).join("\n")
					console.log('language',language, code)
					runCode(code, language).then(function({response, error} ) {
						resolve(response + (error ? "\n### ERROR \n"+error : '' ))
					})
					
				}
			}
		})
	}

	function runCode(code, language) {
		return new Promise(function(resolve,reject) {
			console.log("RUN code",language, code, config)
			let error = ''
			let response = ''
			let found = false
			if (runtimes && Array.isArray(runtimes)) {
				runtimes.forEach(function(r) {
					if (r.language === language || (Array.isArray(r.aliases) && r.aliases.indexOf(language) !== -1)) {
						found = r
					}
					
				})
			}
			if (found) {
				let formData = {
					"language": found.language,
					"version": found.version,
					"files": [
						{
							"name": "sample code",
							"content": code
						}
					],
					"stdin": "",
					"args": [],
					"compile_timeout": 10000,
					"run_timeout": 3000,
					"compile_memory_limit": -1,
					"run_memory_limit": -1
				}
				
				error = ''
				try {
					fetch((config.tools && config.tools.piston_url ? config.tools.piston_url : 'https://emkc.org/api/v2/piston') + '/execute', {
						method: 'POST',
						headers: {
							//'Authorization': 'Bearer '+key,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(formData),
					}).then(function(response) {
						console.log("ai response",response)
						response.json().then(function(t) {
							console.log("CODE RESPONSE",t)
							if (t && t.compile && t.compile.stderr) {
								error = t.compile.stderr
							} else if (t && t.run && t.run.stderr) {
								error = t.run.stderr
							} 
							 
							if (t && t.run && t.run.stdout) {
								response = t.run.stdout
							}  else {
								response = ''
							}
							resolve({response,error})
						})
					})
				} catch (error) {
					let response = ''
					error = String(error)
					resolve({response, error})
					console.error('Speech generateion error:', error);
				}
			}
		})
	}
	
	return {coderunner_load_runtimes, coderunner_run, runCode}
}