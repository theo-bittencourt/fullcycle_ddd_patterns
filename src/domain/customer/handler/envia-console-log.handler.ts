import EventHandlerInterface from '../../@shared/event/event-handler.interface';
import AddressChangedEvent from '../event/address-changed.event';

export default class EnviaConsoleLogHandler implements EventHandlerInterface<AddressChangedEvent> {
  handle(event: AddressChangedEvent) {
    const { customerId, name, address } = event.eventData
    console.log(`%c 'Endereço do cliente: ${customerId}, ${name} alterado para: ${address}'`)
  }
}
