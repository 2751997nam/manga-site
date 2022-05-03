import CustomLink from "@/components/common/CustomLink";
import Image from 'next/image';

const Footer = ({ categories, siteName }) => {
    const logo = siteName == 'TopToon69' ? 'logo69' : 'logo';
    const renderCategories = () => {
        return categories.map(item => {
            return (
                <CustomLink key={item.id} href={'/manga-genre-' + item.slug} className="btn btn-xs btn-secondary m-1">{item.name}</CustomLink>
            )
        })
    }

    return (
        <footer className="main-footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 py-3">
                        <div className="footer float-left">
                            <CustomLink href="/" className="d-inline py-1 my-1 justify-content-center float-none">
                                <Image src={`/images/${logo}.png`} alt="logo" width="200" height="60" />
                            </CustomLink>
                            <div className="mx-auto my-2">
                                The website is content is entirely derived from the internet or contributed by members. If you have a copyright complaint, please contact us and we will remove it as soon as possible. Thanks.
                            </div>
                            <ul className="list-unstyled mt-2 mb-0 d-flex">
                                <li>
                                    <a href="#" className="d-inline-block pr-3 py-2"> <span className="d-none d-sm-inline-block">Term</span></a>
                                </li>
                                <li>
                                    <a href="#" className="d-inline-block pr-3 py-2"><span className="d-none d-sm-inline-block">Lecense</span></a>
                                </li>
                                <li>
                                    <a href="#" className="d-inline-block pr-3 py-2"><span className="d-none d-sm-inline-block">Privacy</span></a>
                                </li>
                                <li>
                                    <a href="#" className="d-inline-block pr-3 py-2"><span className="d-none d-sm-inline-block">Advertising contact</span></a>
                                </li>
                            </ul>
                        </div>
                        <div className="vl d-none d-md-inline-block"></div>
                    </div>
                    <div className="col-md-6 py-3">
                        <div className="tag-footer">
                            {renderCategories()}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;