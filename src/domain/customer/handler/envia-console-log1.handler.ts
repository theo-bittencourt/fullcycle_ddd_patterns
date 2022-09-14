import EventHandlerInterface from '../../@shared/event/event-handler.interface';
import CreatedEvent from '../event/created.event';

export default class EnviaConsoleLog1Handler implements EventHandlerInterface<CreatedEvent> {
  handle(event: CreatedEvent) {
    console.log('%c Esse é o primeiro console.log do evento: CustomerCreated')
  }
}
