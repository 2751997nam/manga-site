import CustomLink from "@/components/common/CustomLink";

const BreadCrumb = (props) => {
    let links = props.links;

    const renderLinks = () => {
        return links.map((link, index) => {
            return (
                <li className={'breadcrumb-item ' + (index == links.length - 1 ? 'active' : '')} key={link.url}>
                    <CustomLink className="text-light" href={link.url}>{link.text}</CustomLink>
                </li>
            )
        })
    }
    
    return (
        <div className="col-md-12">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-primary py-1 px-2">
                    <li className='breadcrumb-item'>
                        <CustomLink className="text-light" href="/">Home</CustomLink>
                    </li>
                    {renderLinks()}
                </ol>
            </nav>
        </div>
    )
}

export default BreadCrumb;