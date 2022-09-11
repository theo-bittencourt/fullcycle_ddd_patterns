import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total,
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total,
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: { id: entity.id },
      }
    );
  }

  async find(id: string): Promise<Order> {
    const model = await OrderModel.findOne({
      where: { id },
      include: ['items'],
    });

    const items = model.items.map(
      (itemModel) =>
        new OrderItem(
          itemModel.id,
          itemModel.name,
          itemModel.price,
          itemModel.product_id,
          itemModel.quantity
        )
    );

    return new Order(model.id, model.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const models = await OrderModel.findAll({ include: 'items'});

    return models.map((model) => {
      const items = model.items.map(
        (itemModel) =>
          new OrderItem(
            itemModel.id,
            itemModel.name,
            itemModel.price,
            itemModel.product_id,
            itemModel.quantity
          )
      );

      return new Order(model.id, model.customer_id, items);
    });
  }
}
