import EventDispatcher from '../../@shared/event/event-dispatcher';
import EnviaConsoleLogHandler from '../handler/envia-console-log.handler';
import EnviaConsoleLog1Handler from '../handler/envia-console-log1.handler';
import EnviaConsoleLog2Handler from '../handler/envia-console-log2.handler';
import Address from "../value-object/address";
import Customer from "./customer";

const eventDispatcher = new EventDispatcher();

describe("Customer unit tests", () => {
  beforeEach(() => {
    eventDispatcher.unregisterAll()
  })

  it("should notify CreatedEvent when new Customer is created", () => {

    const handler1 = new EnviaConsoleLog1Handler()
    const handler2 = new EnviaConsoleLog2Handler()
    eventDispatcher.register('CreatedEvent', handler1)
    eventDispatcher.register('CreatedEvent', handler2)

    const dispatcherSpy = jest.spyOn(eventDispatcher, 'notify');
    const handle1Spy = jest.spyOn(handler1, 'handle');
    const handle2Spy = jest.spyOn(handler2, 'handle');

    new Customer("123", "Pedro", eventDispatcher);

    expect(dispatcherSpy).toBeCalled();
    expect(handle1Spy).toBeCalled();
    expect(handle2Spy).toBeCalled();
  });

  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  fit("should notify AddressChangedEvent when changeAddress() is called", () => {
    const customer = new Customer("1", "Customer 1", eventDispatcher);
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    const handler = new EnviaConsoleLogHandler()
    eventDispatcher.register('AddressChangedEvent', handler)

    const handlerSpy = jest.spyOn(handler, 'handle');

    customer.changeAddress(new Address('5th Street', 12, '2221321', 'New York'));

    expect(handlerSpy).toBeCalledWith(expect.objectContaining({
      eventData: {
        customerId: '1',
        name: 'Customer 1',
        address: expect.objectContaining({
          street: '5th Street',
          number: 12,
          zip: '2221321',
          city: 'New York'
        })
      }
    }))
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });
});
