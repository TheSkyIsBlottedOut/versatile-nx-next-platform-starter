#  SSL @ Home

You need to test google. What do you do?

1. `sudo nano /etc/hosts` and add something like `127.0.0.1   local.getpalm.com`
1.  `brew install mkcert`
1. `mkcert -install`
Now you have a root cert. Do not use this. There are certs in vpcs/etc/ but you might need your own.
1. `mkcert -cert-file vpcs/etc/certs/local.getpalm.com.pem -key-file vpcs/etc/certs/local.getpalm.com-key.pem local.getpalm.com`
1. `vpcs serve|dev`
1. `vpcs scherzo sslproxy`

Now you can navigate to https://local.getpalm.com:4444 and use the login.