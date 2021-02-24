# Restore sessions after reloading server

Urban bot loses all sessions after server reloading when you restart nodejs process.


It is ok if you have a usual interactive chatbot because the session will be restart after the first user action. But if you have some notification waiting or subscriptions it can be a problem.


This is an example of how to allow to keep all sessions between reloading via `local storage`.