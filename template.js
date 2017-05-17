var e = function(selector) {
    return document.querySelector(selector)
}



var ajax = function(path, method, header, data, responseCallback) {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if(r.readyState == 4 && r.status == 200) {
            responseCallback(r)
        }
    }
    r.send(data)
}

var last_days = 5

var path = ["/api/dashboard/charts", "/api/dashboard/statistics", "/api/dashboard/top_charts", "/api/dashboard/log_charts", "/api/dashboard/top_webshell", "/api/dashboard/sys_status", "/api/dashboard/agents"]

var method = "GET"

var header = ""

var data = {
    "last_days": last_days
}

ajax(path[0], method, header, data, r => {
	obj1 = {}
	flotDashSales1Data = []
	flotDashSales2Data = []
	flotDashSales3Data = []
	obj1 = JSON.parse(r.response)
	
	var tmp1 = obj1.result.flotDashSales1Data
	var tmp2 = obj1.result.flotDashSales2Data
	var tmp3 = obj1.result.flotDashSales3Data
	flotDashSales1Data.push(tmp1)
	flotDashSales2Data.push(tmp2)
	flotDashSales3Data.push(tmp3)
})

ajax(path[1], method, header, data, r => {
	obj2 = {}
	obj2 = JSON.parse(r.response)
	
	var tmp1 = (obj2.result)["webshell_val"]
	var tmp2 = (obj2.result)["danger_val"]
	var element = e('#meterSales')
	element.value = `${tmp1}`
	
	var a = e("#meterSalesSel")
	a.children[0].dataset.val = `${tmp1}`
	a.children[1].dataset.val = `${tmp2}`


	var elements = es('.amount')
	var ele = e('.text-primary')
	var tmp3 = (obj2.result)["site_num"]
	elements[0].innerHtml = tmp3
	tmp3 = (obj2.result)["agent_num"]
	ele.innerHtml = `(${tmp3} agents)`
	elements[1].innerHtml = (obj2.result)["webshell_num"]
	elements[2].innerHtml = (obj2.result)["lib_num"]
	elements[3].innerHtml = (obj2.result)["danger_num"]
})


ajax(path[2], method, header, data, r => {
	var obj3 = {}
	obj3 = JSON.parse(r.response)
	flotDashBasicData = obj3.result
})


ajax(path[4], method, '', null, r => {
	var obj3 = {}
	obj3 = JSON.parse(r.response)

	var elements = es('.progress-bar')
	var elements1 = es('.label')
	var a = obj3.result

	for(var i = 0; i < elements.length; i++) {
		elements[i].style['width'] = `${a[i].progress}%`
		elements[i].innerHTML = `${a[i].progress}%`
		if(a[i].status == 1) {
			elements1[i].innerHTML = "Danger"
		} else if(a[i].status == 2) {
			elements1[i].innerHTML = "Warning"
		} else if(a[i].status == 3){
			elements1[i].innerHTML = "Success"
		} else {
			elements1[i].innerHTML = "Unknown"
		}
	}
})

ajax(path[5], method, header, data, r => {
	var obj3 = {}
	obj3 = JSON.parse(r.response)
	sparklineBarDashData = obj3.result.net
	sparklineLineDashData = obj3.result.mem
	var element = e('.circular-bar-chart')
	element.dataset.percent = (obj3.result.cpu).toString()
	element = e('.percent')
	element.innerHTML = (obj3.result.cpu).toString()
})


ajax(path[6], method, header, data, r => {
	var obj3 = {}
	obj3 = JSON.parse(r.response)
	console.log('*** 对象', obj3)
	var imgs = es('.img-circle')
	var user = e('.simple-user-list')
	for(var i = 1; i < imgs.length + 1; i++) { 
		user.children[i-1].children[1].innerHTML = (obj3.result[i-1])["agent_name"]
		user.children[i-1].children[2].innerHTML = (obj3.result[i-1])["agent_ip"]
		if(i = imgs.length) {
			break;
		}
		if ( (obj3.result[i-1])["agent_type"] === "apache") {
			imgs[i].src = "static/images/logo-apache.jpg"
		} else if ( (obj3.result[i-1])["agent_type"] === "nginx" ) {
			imgs[i].src = "static/images/logo-nginx.jpg"
		}
	}
})

