import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { v4 as uuidv4 } from 'uuid';

type FAQ = {
  id: string;
  question: string;
  answer: string;
};
const faqs: FAQ[] = [
  {
    id: uuidv4(),
    question: 'How to track my order?',
    answer:
      'You can view and track your orders by logging into your account space. In this space, you can also access your order history.',
  },
  {
    id: uuidv4(),
    question: 'What max number of tickets I can buy?',
    answer: "You can buy up to 3 tickets per each event's option.",
  },
  {
    id: uuidv4(),
    question: 'How do I print and view my tickets?',
    answer:
      'Every ticket will be available on your orders history, you can take a screenshot and print them if you want.',
  },
  {
    id: uuidv4(),
    question:
      'The payment is executed, and I have not yet received the order confirmation email?',
    answer:
      'It can sometimes take several minutes for the e-mail to be received. After this time, check your junk mail or spam folder, the message may be there.',
  },
  {
    id: uuidv4(),
    question: 'Is it possible to change or get a refund for tickets?',
    answer:
      'All orders are firm and final. Tickets cannot be returned, exchanged or resold. No cancellation or refund will therefore be possible. Tickets remain valid in the event of a change in the match date and time.',
  },
  {
    id: uuidv4(),
    question: 'I bought 2 tickets and I only received one?',
    answer:
      "Each ticket has a quantity, that's how many you can print. If you bought 2, you can print 2 copies of the same ticket. DISCAIMER: You can't cheat and print 3 or 4 because that will not be validated during event entry.",
  },
] as const;

function FAQs() {
  return (
    <div className="container">
      <div className="my-5 border rounded-2xl">
        <div className="p-5">
          <h2 className="text-2xl font-semibold tracking-tight scroll-m-20">
            FAQs
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.id} value={`item-${i + 1}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="dark:text-slate-200">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default FAQs;
