import test from 'ava' ;

import {_calloc} from '@array-like/alloc';
import {iota} from '@array-like/fill';
import {shuffle} from '@randomized/random';
import {increasing, decreasing} from '@total-order/primitive';
import {star} from "@functional-abstraction/functools" ;
import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {_chain as chain} from '@iterable-iterator/chain';
import {exhaust} from '@iterable-iterator/consume';
import {product} from '@set-theory/cartesian-product';

import {ispartitioned, yaroslavskiy, whole} from "../../src" ;

function check ( partitionname, method, ctor, n, comparename, compare ) {

	const title = `whole ${partitionname} (new ${ctor.name}(${n}), ${comparename})` ;
	const calloc = _calloc(ctor);

	method = whole( method ) ;

	test( title, t => {

		// SETUP ARRAY
		const a = calloc(n);
		iota( a, 0, n, 0 );

		// PARTITION ARRAY
		shuffle( a, 0, n );
		const x = method( compare, a );

		const p = x[0] ;
		const q = x[1] ;

		// TEST PREDICATE

		t.true( p <= q , "check p <= q" ) ;
		t.is( ispartitioned( compare , a , 0 , n , p ) , n , "check partitioned p" ) ;
		t.is( ispartitioned( compare , a , 0 , n , q ) , n , "check partitioned q" ) ;
		t.is( a.length, n, "check length a" );

	} );
}

exhaust( map(
function ( args ) {

	star( function ( partitionname, partition, comparename, compare, size, type ) {

		if ( type.BYTES_PER_ELEMENT && size > Math.pow( 2, type.BYTES_PER_ELEMENT * 8 ) ) {
			return;
		}

		check( partitionname, partition, type, size, comparename, compare );

	}, list( chain( args ) ) ) ;

} ,


product( [

[
	[ "yaroslavskiy", yaroslavskiy ]
],

[
	[ "increasing", increasing ],
	[ "decreasing", decreasing ]
],

[[1], [2], [10], [63], [64], [65]],

[
	[ Array ],
	[ Int8Array ],
	[ Uint8Array ],
	[ Int16Array ],
	[ Uint16Array ],
	[ Int32Array ],
	[ Uint32Array ],
	[ Float32Array ],
	[ Float64Array ]
]

], 1 ) ) );
