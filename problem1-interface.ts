// notification

interface NotificationService{
    send(recipient: string, message: string) : void
}

class SlackNotification implements NotificationService {

    send (recipient: string, message: string) : void{
        console.log(`to ${recipient} this is message ${message} | this is slack`)
    }
}

class EmailNotification implements NotificationService{
    send (recipient: string, message: string): void{
        console.log(`to ${recipient} this is message ${message} via email`)
    }
}

class TriggerNotification {

    private notifire : NotificationService
    constructor (notifire: NotificationService)
    {
        this.notifire = notifire
    }

    triggerNotification(recipient:  string, message: string): void {
        this.notifire.send(recipient, message)
    }

}

const slackNotificationObject = new SlackNotification
const EmailNotificationObject = new EmailNotification

const slack = new TriggerNotification(slackNotificationObject)
const email = new TriggerNotification(EmailNotificationObject)

// here we only called trigger notification 
email.triggerNotification("naman" , "I am on computer")
slack.triggerNotification("wade", "using linux")