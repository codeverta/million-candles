<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use \DB;

class TrackProductViews
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
	
        if ($request->route()->getName() === 'v1.products.index' && $request->input("filter.slug")) {
            $slug = $request->input("filter.slug");

            if ($slug) {
            // Only count unique views (by session)
            $viewKey = 'product_viewed_' . $slug;
            if (!session()->has($viewKey)) {
                DB::table('products')->where('slug', $slug)->increment('views_count');
                session()->put($viewKey, true);
            }
            } else {
            return $response;
            }
        }
        
        return $response;
    }
}
