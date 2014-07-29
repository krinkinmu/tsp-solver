var ds = (function () {
    var RED = 1, BLACK = 2;

    function Node(value) {
        this.value = value;
        this.color = BLACK;
        this.left = null;
        this.right = null;
        this.parent = null;
    }

    function is_red(x) {
        return x && x.color == RED;
    }

    function rotate_left(tree, x) {
        var y = x.right;
        x.right = y.left;
        if (y.left) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (tree.root == x) {
            tree.root = y;
        } else {
            if (x == x.parent.left) {
                x.parent.left = y;
            } else {
                x.parent.right = y;
            }
        }
        y.left = x;
        x.parent = y;
    }

    function rotate_right(tree, x) {
        var y = x.left;
        x.left = y.right;
        if (y.right) {
            y.right.parent = x;
        }
        y.parent = x.parent;
        if (tree.root == x) {
            tree.root = y;
        } else {
            if (x == x.parent.left) {
                x.parent.left = y;
            } else {
                x.parent.right = y;
            }
        }
        y.right = x;
        x.parent = y;
    }

    function left_most(x) {
        while (x && x.left) {
            x = x.left;
        }
        return x;
    }

    function right_most(x) {
        while (x && x.right) {
            x = x.right;
        }
        return x;
    }

    function successor(x) {
        if (!x) {
            return null;
        }
        if (x.right) {
            return left_most(x.right);
        }
        while (x.parent && x.parent.right == x) {
            x = x.parent;
        }
        return x.parent;
    }

    function predcessor(x) {
        if (!x) {
            return x;
        }
        if (x.left) {
            return right_most(x.left);
        }
        while (x.parent && x.parent.left == x) {
            x = x.parent;
        }
        return x.parent;
    }

    function insert_fixup(tree, x) {
        while (x != tree.root && is_red(x.parent)) {
            if (x.parent == x.parent.parent.left) {
                var y = x.parent.parent.right;
                if (is_red(y)) {
                    x.parent.color = BLACK;
                    y.color = BLACK;
                    y.parent.color = RED;
                    x = y.parent;
                } else {
                    if (x == x.parent.right) {
                        x = x.parent;
                        rotate_left(tree, x);
                    }
                    x.parent.color = BLACK;
                    x.parent.parent.color = RED;
                    rotate_right(tree, x.parent.parent);
                }
            } else {
                var y = x.parent.parent.left;
                if (is_red(y)) {
                    x.parent.color = BLACK;
                    y.color = BLACK;
                    y.parent.color = RED;
                    x = y.parent;
                } else {
                    if (x == x.parent.left) {
                        x = x.parent;
                        rotate_right(tree, x);
                    }
                    x.parent.color = BLACK;
                    x.parent.parent.color = RED;
                    rotate_left(tree, x.parent.parent);
                }
            }
        }
        tree.root.color = BLACK;
    }

    function delete_fixup(tree, x, xparent) {
        while (x != tree.root && !is_red(x)) {
            if (x == xparent.left) {
                var y = xparent.right;
                if (is_red(y)) {
                    y.color = BLACK;
                    xparent.color = RED;
                    rotate_left(tree, xparent);
                    y = xparent.right;
                }
                if (!is_red(y.left) && !is_red(y.right)) {
                    y.color = RED;
                    x = xparent;
                    xparent = xparent.parent;
                } else {
                    if (!is_red(y.right)) {
                        if (y.left) {
                            y.left.color = BLACK;
                        }
                        y.color = RED;
                        rotate_right(tree, y);
                        y = xparent.right;
                    }
                    y.color = xparent.color;
                    xparent.color = BLACK;
                    if (y.right) {
                        y.right.color = BLACK;
                    }
                    rotate_left(tree, xparent);
                    x = tree.root;
                }
            } else {
                var y = xparent.left;
                if (is_red(y)) {
                    y.color = BLACK;
                    xparent.color = RED;
                    rotate_right(tree, xparent);
                    y = xparent.left;
                }
                if (!is_red(y.right) && !is_red(y.right)) {
                    y.color = RED;
                    x = xparent;
                    xparent = xparent.parent;
                } else {
                    if (!is_red(y.left)) {
                        if (y.right) {
                            y.right.color = BLACK;
                        }
                        y.color = RED;
                        rotate_left(tree, y);
                        y = xparent.left;
                    }
                    y.color = x.parent.color;
                    xparent.color = BLACK;
                    if (y.left) {
                        y.left.color = BLACK;
                    }
                    rotate_right(tree, x.parent);
                    x = tree.root;
                }
            }
        }
        if (x) {
            x.color = BLACK;
        }
    }

    function insert_node(tree, x) {
        var node = tree.root, parent = null, cmp = undefined;
        while (node) {
            cmp = tree.cmp(x.value, node.value);
            parent = node;
            node = cmp < 0 ? node.left : node.right;
        }
        x.parent = parent;
        x.color = RED;
        if (parent) {
            if (cmp < 0) {
                parent.left = x;
            } else {
                parent.right = x;
            }
        } else {
            tree.root = x;
        }
        insert_fixup(tree, x);
        tree.size = tree.size + 1;
    }

    function remove_node(tree, z) {
        if (!z.left && !z.right) {
            var parent = z.parent;
            if (parent) {
                if (parent.left == z) {
                    parent.left = null;
                } else {
                    parent.right = null;
                }
                if (!is_red(z)) { 
                    delete_fixup(tree, null, parent);
                }
            } else {
                tree.root = null;
            }
        } else if (!z.left || !z.right) {
            var x = z.left ? z.left : z.right;
            x.parent = z.parent;
            if (z.parent) {
                if (z.parent.left == z) {
                    z.parent.left = x;
                } else {
                    z.parent.right = x;
                }
            } else {
                tree.root = x;
            }
            if (!is_red(z)) {
                delete_fixup(tree, x, z.parent);
            }
        } else {
           var x = left_most(z.right);
           var c = x.color;
           x.color = z.color
           z.color = c;
           if (x == z.right) {
               x.left = z.left;
               x.parent = z.parent;
               z.left.parent = x;
               if (z.parent) {
                   if (z.parent.left == z) {
                       z.parent.left = x;
                   } else {
                       z.parent.right = x;
                   }
               } else {
                   tree.root = x;
               }
               if (!is_red(z)) {
                   delete_fixup(tree, x.right, x);
               }
           } else {
               var xparent = x.parent;
               xparent.left = null;
               x.parent = z.parent;
               if (z.parent) {
                   if (z.parent.left == z) {
                       z.parent.left = x;
                   } else {
                       z.parent.right = x;
                   }
               } else {
                   tree.root = x;
               }
               x.left = z.left;
               z.left.parent = x;
               x.right = z.right;
               z.right.parent = x;
               if (!is_red(z)) {
                   delete_fixup(tree, null, xparent);
               }
           }
        }
        tree.size = tree.size - 1;
    }

    function Iterator(t, n) {
        this._impl = { tree: t, node: n };
    }

    Iterator.prototype.clone = function() {
        return new Iterator(this._impl.tree, this._impl.node);
    }

    Iterator.prototype.next = function () {
        this._impl.node = successor(this._impl.node);
    }

    Iterator.prototype.prev = function () {
        if (!this._impl.node) {
            this._impl.node = right_most(this._impl.tree.root);
        }
        this._impl.node = predcessor(this._impl.node);
    }

    Iterator.prototype.equal = function (iter) {
        return this._impl.tree === iter._impl.tree &&
               this._impl.node === iter._impl.node;
    }

    Iterator.prototype.erase = function () {
        var next = successor(this._impl.node);
        remove_node(this._impl.tree, this._impl.node);
        this._impl.node.left = null;
        this._impl.node.right = null;
        this._impl.node.parent = null;
        this._impl.node = next;
    }

    Iterator.prototype.value = function () {
        return this._impl.node && this._impl.node.value;
    }

    function Tree(comparator) {
        this._impl = {
            root: null,
            size: 0,
            cmp: comparator
        };
    }

    Tree.prototype.begin = function () {
        return new Iterator(this._impl, left_most(this._impl.root));
    }

    Tree.prototype.end = function () {
        return new Iterator(this._impl, null);
    }

    Tree.prototype.lowerBound = function (value) {
        var parent = null, current = this._impl.root;
        while (current) {
            if (this._impl.cmp(current.value, value) >= 0) {
                parent = current;
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return new Iterator(this._impl, parent);
    }

    Tree.prototype.upperBound = function (value) {
        var parent = null, current = this._impl.root;
        while (current) {
            if (this._impl.cmp(value, current.value) < 0) {
                parent = current;
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return new Iterator(this._impl, parent);
    }

    Tree.prototype.lookup = function (value) {
        var iter = this.upperBound(value);
        if (this._impl.cmp(iter.value(), value) == 0) {
            return iter;
        }
        return this.end();
    }

    Tree.prototype.insert = function (value) {
        var node = new Node(value);
        insert_node(this._impl, node);
        return new Iterator(this._impl, node);
    }

    Tree.prototype.insertUnique = function (value) {
        var iter = this.lookup(value);
        if (iter.equal(this.end())) {
            return this.insert(value);
        }
        return iter;
    }

    Tree.prototype.size = function () {
        return this._impl.size;
    }

    Tree.prototype.empty = function () {
        return this.size() == 0;
    }

    return {
        SearchTree: Tree,

        eraseAll: function (first, last) {
            if (first._impl.tree != last._impl.tree) {
                throw Error("Iterators are not belong to same tree");
            }
            while (!first.equal(last)) {
                first.erase();
            }
        },

        next: function (iter) {
            var copy = iter.clone();
            copy.next();
            return copy;
        },

        prev: function (iter) {
            var copy = iter.clone();
            copy.prev();
            return copy;
        }
    };
}())


function buildGraph(distance, points, timeStep) {
    var referenceTime = points[0].from;
    var graph = {};

    function makeEdge(v, u, cost) {
        var times = (graph[v.index] || {});
        var neigh = (times[v.time] || []);
        neigh.push({ "dst": u, "distance": cost });
        times[v.time] = neigh;
        graph[v.index] = times;
    }

    function roundDown(time) {
        return referenceTime + timeStep *
            Math.floor((time - referenceTime)/timeStep);
    }

    function roundUp(time) {
        return referenceTime + timeStep *
            Math.ceil((time - referenceTime)/timeStep);
    }

    for (var vindex = 0; vindex < points.length; ++vindex) {
        for (var currentTime = roundDown(points[vindex].from);
                   currentTime < points[vindex].to; currentTime += timeStep) {
            makeEdge({ index: vindex, time: currentTime },
                     { index: vindex, time: currentTime + timeStep }, 0);
            for (var uindex = 0; uindex < points.length; ++uindex) {
                if (vindex == uindex) {
                    continue;
                }

                var cost = distance(points[vindex], points[uindex]);
                var destinationTime = roundUp(currentTime + cost);
                if (destinationTime > roundUp(points[uindex].to) ||
                      destinationTime < roundDown(points[uindex].from)) {
                    continue;
                }

                makeEdge({ index: vindex, time: currentTime },
                         { index: uindex, time: destinationTime },
                         cost);
            }
        }
    }

    return graph;
}


function makeRoute(distance, points, timeStep) {
    var cost = { };

    function updateCost(v, time, prev) {
        var masks = cost[v.index] || {};
        var times = masks[v.mask] || {};
        times[v.time] = { "time": time, "prev": prev };
        masks[v.mask] = times; 
        cost[v.index] = masks;
    }

    function getCost(v) {
        return cost[v.index] && cost[v.index][v.mask] &&
               cost[v.index][v.mask][v.time];
    }

    function makePath(v) {
        if (v == null) {
            return [];
        }
        var prefix = makePath(cost[v.index][v.mask][v.time].prev);
        prefix.push(v);
        return prefix;
    }

    function compare(v, u) {
        var vcost = cost[v.index][v.mask][v.time];
        var ucost = cost[u.index][u.mask][u.time];
        return (v.time - u.time) || (vcost.time - ucost.time) ||
               (v.mask - u.mask) || (v.index - u.index);
    }

    var root = { "index": 0,
                 "mask": Math.pow(2, points.length) - 2,
                 "time": points[0].from };
    updateCost(root, 0, null);

    var graph = buildGraph(distance, points, timeStep);
    var queue = new ds.SearchTree(compare);
    queue.insert(root);

    while (!queue.empty()) {
        var frontIt = queue.begin();
        var v = frontIt.value(); frontIt.erase();

        if (v.mask == 0) {
            return makePath(v);
        }

        var neigh = graph[v.index][v.time] || [];
        for (var nindex = 0; nindex < neigh.length; ++nindex) {
            var uinfo = neigh[nindex];
            var u = { "index": uinfo.dst.index,
                      "mask": v.mask & (~(1 << uinfo.dst.index)),
                      "time": uinfo.dst.time };
            var newCost = uinfo.distance + getCost(v).time;
            var oldCost = getCost(u);
            if (oldCost === undefined) {
                updateCost(u, newCost, v);
                queue.insert(u);
            } else if (oldCost > newCost) {
                queue.lookup(u).erase();
                updateCost(u, newCost, v);
                queue.insert(u);
            }
        }
    }
}


var points = [
    {
        index: 0,
        from: 0,
        to: 1140,
    },
    {
        index: 1,
        from: 1020,
        to: 1140,
    },
    {
        index: 2,
        from: 1020,
        to: 1140,
    },
    {
        index: 3,
        from: 1020,
        to: 1140,
    }
];

function distances(from, to) {
    var dist = [[0, 22, 21, 29], [22, 0, 16, 31], [21, 16, 0, 19], [29, 31, 19, 0]];
    return dist[from.index][to.index];
}

console.log(makeRoute(distances, points, 5));
