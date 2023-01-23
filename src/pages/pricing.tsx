import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types'
import { useUserContext } from "@/context/user";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

type Plan = {
    id: string;
    name: string;
    price: number;
    interval: string;
    currency: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY as string);

export default function Pricing ({ plans }: { plans: Plan[] }) {
    const { user, login, isLoading } = useUserContext();

    const processSubscription = (planId: string) => async () => {
        const response = await fetch(`/api/subscription/${planId}`, {
            method: 'POST'
        });
        const data = await response.json();

        window.location.href = data.stripeSession.url;
    };

    const showSubscribeButton = user && !user.is_subscribed;
    const showCreateAccountButton = !user;
    const showManageSubscriptionButton = user && user.is_subscribed;

    return (
        <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
            {plans.map((plan: Plan) => (
                <div key={plan.id} className="w-80 rounded shadow px-6 py-4">
                    <h2 className="text-xl">{plan.name}</h2>
                    <p className="text-gray-500">
                        ${plan.price / 100} / {plan.interval}
                    </p>
                    {!isLoading && (
                        <div>
                            {showSubscribeButton && (
                                <button onClick={processSubscription(plan.id)} className="w-full justify-center rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">
                                    Subscribe
                                </button>
                            )}
                            {showCreateAccountButton && (
                                <button onClick={login} className="w-full justify-center rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">
                                    Create Account
                                </button>
                            )}
                            {showManageSubscriptionButton && (
                                <Link href="/dashboard" legacyBehavior>
                                    <a className="w-full block justify-center rounded-lg text-center text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">Manage Subscription</a>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

    // Create authenticated Supabase Client
	const supabaseServerClient = createServerSupabaseClient<Database>(ctx);

	// Check if we have a session
	const {
		data: { session },
	} = await supabaseServerClient.auth.getSession();

    const { data: prices } = await stripe.prices.list();

    const plans = await Promise.all(
        prices.map(async (price: any) => {
            const product = await stripe.products.retrieve(price.product);

            return {
                id: price.id,
                name: product.name,
                price: price.unit_amount,
                interval: price.recurring.interval,
                currency: price.currency,
            };
        })
    );

    const sortedPlans = plans.sort((a, b) => a.price - b.price);

    if (!session) {
		return {
			props: {
				plans: sortedPlans,
			},
		}
	}

	return {
		props: {
			plans: sortedPlans,
            initialSession: session,
			user: session.user,
		},
	};
};