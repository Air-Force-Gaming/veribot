# veribot

I verify users for airforcegaming.com.

several other version as present for reference of what went wrong.

Things to fix:
embedded message throws error. It thinks the information in the email field is a timestamp.

Use this as your postman:

<pre><code>
{
	"data": { 
		"message_id":"3a1fac0c-f960-4506-a60e-824979a74e74",
		"timestamp":"2017-08-21T13:04:30.7296166Z",
		"type":"Donation","real_name":"John Smith",
		"disc_name":"Salty#0217", "email":"first.last@us.af.mil",
		"url":"https://ko-fi.com"
	}
}
</code></pre>
