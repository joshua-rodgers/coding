from flask import render_template
from . import gamedev_pd_bp

@gamedev_pd_bp.route('/')
def arcade_lobby():
    """Main arcade lobby with 4 domain cabinets"""
    domains = [
        {
            'id': 'domain1',
            'number': 1,
            'title': 'Game Design Fundamentals',
            'total_pages': 38,
            'standards': ['1.1', '1.2', '1.3']
        },
        {
            'id': 'domain2',
            'number': 2,
            'title': 'Programming for Games',
            'total_pages': 39,
            'standards': ['2.1', '2.2', '2.3']
        },
        {
            'id': 'domain3',
            'number': 3,
            'title': 'Creative Assets and User Experience',
            'total_pages': 27,
            'standards': ['3.1', '3.2']
        },
        {
            'id': 'domain4',
            'number': 4,
            'title': 'Industry and Career Connections',
            'total_pages': 30,
            'standards': ['4.1', '4.2']
        }
    ]
    return render_template('arcade_lobby.html', domains=domains)

@gamedev_pd_bp.route('/domain/<int:domain_num>/page/<int:page_num>')
def domain_page(domain_num, page_num):
    """Individual page within a domain"""

    # Domain metadata
    domains_meta = {
        1: {'title': 'Game Design Fundamentals', 'total_pages': 38},
        2: {'title': 'Programming for Games', 'total_pages': 39},
        3: {'title': 'Creative Assets and User Experience', 'total_pages': 27},
        4: {'title': 'Industry and Career Connections', 'total_pages': 30}
    }

    domain_info = domains_meta.get(domain_num)
    if not domain_info:
        return "Domain not found", 404

    if page_num < 1 or page_num > domain_info['total_pages']:
        return "Page not found", 404

    # Calculate navigation
    has_prev = page_num > 1
    has_next = page_num < domain_info['total_pages']

    return render_template(
        'domain_page.html',
        domain_num=domain_num,
        page_num=page_num,
        domain_title=domain_info['title'],
        total_pages=domain_info['total_pages'],
        has_prev=has_prev,
        has_next=has_next
    )
