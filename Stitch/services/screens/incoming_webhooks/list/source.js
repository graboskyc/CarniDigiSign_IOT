// Try running in the console below.
function formatDate(d) {
  var date = new Date(d.getTime()-5*3600*1000); // bad utc calculations
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

function f(val,l) {
  if ((val == "undefined") || (val == null) || (val == undefined)) {
    return '';
  } else {
    if(l==0) {
    return val;
    } else {
      return val.slice(l);
    }
  }
}
  
exports = async function(payload,response) {
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  var r = '';
  
  
  
  r = r + "<html><head><title>Device Inventory Details</title></head>";
  r = r +'<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">';
  r = r + '<style>td,th { padding:5px; } td{font-size:14px;} .form-signin { max-width:70% !important; text-align:center; width:70%;margin-left:15%; } body { padding-top: 40px;  padding-bottom: 40px;  background-color: #f5f5f5; height:100%; width:100%;} </style>';
  r = r + '<script src="https://use.fontawesome.com/4132d47bbc.js"></script>';
  r = r + "<body><h1 class='form-signin'>Registered Devices</h1><table class='form-signin table table-striped'>";
  r = r + "<thead class='thead-dark'><tr><th>MAC</th><th>IP</th><th>Token</th><th>Location</th><th>Last Seen</th><th><i class='fa fa-link' aria-hidden='true'></i></th></tr></thead><tbody>";
  
  let docs = await conn.find().toArray();
  
  for(var i = 0; i < docs.length; i++) {
    r = r + "<tr>";
    r = r + "<td><code>"+f(docs[i].mac,-8)+"</code></td>";
    r = r + "<td><code>"+f(docs[i].ip,0)+"</code></td>";
    r = r + "<td><code>"+f(docs[i].token,0).slice(0,3)+'...'+f(docs[i].token,-8)+"</code></td>";
    r = r + "<td>"+docs[i].location|| ''+"</td>";
    var url = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/digisign-ywoti/service/screens/incoming_webhook/details?docid="+docs[i]._id;
    r = r + "<td>"+formatDate(docs[i].lastseen)|| ''+"</td>";
    r = r + "<td><a href='"+url+"'><i class='fa fa-link' aria-hidden='true'></i></a></td>";
    r = r + "</tr>";
  };
  
  r = r + "</tbody></table></body></html>";
 
  response.setHeader("Content-Type", "text/html");
  response.setBody(r);

};